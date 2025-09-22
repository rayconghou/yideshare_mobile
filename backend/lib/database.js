const { PrismaClient } = require('@prisma/client');

// Singleton Prisma client
let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }
  return prisma;
}

/**
 * Ride Database Operations
 */
const RideDB = {
  /**
   * Search for available rides
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Array of rides
   */
  async searchRides(filters = {}) {
    const client = getPrismaClient();
    
    const where = {
      isClosed: false,
      ...filters
    };

    return await client.ride.findMany({
      where,
      include: {
        owner: {
          select: {
            netId: true,
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                netId: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            bookmarks: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  },

  /**
   * Create a new ride
   * @param {Object} rideData
   * @returns {Promise<Object>}
   */
  async createRide(rideData) {
    const client = getPrismaClient();
    
    return await client.ride.create({
      data: {
        ownerNetId: rideData.ownerNetId,
        ownerName: rideData.ownerName,
        ownerPhone: rideData.ownerPhone,
        beginning: rideData.beginning,
        destination: rideData.destination,
        description: rideData.description || '',
        startTime: new Date(rideData.startTime),
        endTime: new Date(rideData.endTime),
        totalSeats: rideData.totalSeats || 4,
        currentTakenSeats: 0,
        isClosed: false,
      },
      include: {
        owner: {
          select: {
            netId: true,
            name: true,
            email: true
          }
        }
      }
    });
  },

  /**
   * Get rides owned by a user
   * @param {string} netId
   * @returns {Promise<Array>}
   */
  async getUserRides(netId) {
    const client = getPrismaClient();
    
    return await client.ride.findMany({
      where: {
        ownerNetId: netId
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                netId: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            bookmarks: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });
  },

  /**
   * Update ride information
   * @param {string} rideId
   * @param {string} ownerNetId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateRide(rideId, ownerNetId, updateData) {
    const client = getPrismaClient();
    
    // Verify ownership
    const ride = await client.ride.findFirst({
      where: {
        rideId,
        ownerNetId
      }
    });

    if (!ride) {
      throw new Error('Ride not found or unauthorized');
    }

    return await client.ride.update({
      where: { rideId },
      data: updateData,
      include: {
        owner: {
          select: {
            netId: true,
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                netId: true,
                name: true
              }
            }
          }
        }
      }
    });
  },

  /**
   * Delete a ride
   * @param {string} rideId
   * @param {string} ownerNetId
   * @returns {Promise<Object>}
   */
  async deleteRide(rideId, ownerNetId) {
    const client = getPrismaClient();
    
    // Verify ownership
    const ride = await client.ride.findFirst({
      where: {
        rideId,
        ownerNetId
      }
    });

    if (!ride) {
      throw new Error('Ride not found or unauthorized');
    }

    return await client.ride.delete({
      where: { rideId }
    });
  }
};

/**
 * User Database Operations
 */
const UserDB = {
  /**
   * Create or update user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async upsertUser(userData) {
    const client = getPrismaClient();
    
    return await client.user.upsert({
      where: { netId: userData.netId },
      update: {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        avatarType: userData.avatarType
      },
      create: {
        netId: userData.netId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        avatarType: userData.avatarType
      }
    });
  },

  /**
   * Get user by NetID
   * @param {string} netId
   * @returns {Promise<Object|null>}
   */
  async getUserByNetId(netId) {
    const client = getPrismaClient();
    
    return await client.user.findUnique({
      where: { netId },
      include: {
        _count: {
          select: {
            ridesOwned: true,
            ridesParticipated: true,
            bookmarks: true
          }
        }
      }
    });
  }
};

/**
 * Bookmark Database Operations
 */
const BookmarkDB = {
  /**
   * Toggle bookmark for a ride
   * @param {string} netId
   * @param {string} rideId
   * @returns {Promise<Object>}
   */
  async toggleBookmark(netId, rideId) {
    const client = getPrismaClient();
    
    const existingBookmark = await client.bookmark.findUnique({
      where: {
        netId_rideId: {
          netId,
          rideId
        }
      }
    });

    if (existingBookmark) {
      await client.bookmark.delete({
        where: { bookmarkId: existingBookmark.bookmarkId }
      });
      return { bookmarked: false, message: 'Bookmark removed' };
    } else {
      await client.bookmark.create({
        data: { netId, rideId }
      });
      return { bookmarked: true, message: 'Bookmark added' };
    }
  },

  /**
   * Get user's bookmarked rides
   * @param {string} netId
   * @returns {Promise<Array>} Bookmarked rides or empty array
   */
  async getUserBookmarks(netId) {
    const client = getPrismaClient();
    
    const bookmarks = await client.bookmark.findMany({
      where: { netId },
      include: {
        ride: {
          include: {
            owner: {
              select: {
                netId: true,
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                participants: true,
                bookmarks: true
              }
            }
          }
        }
      },
      orderBy: {
        ride: {
          startTime: 'asc'
        }
      }
    });

    return bookmarks.map(bookmark => bookmark.ride);
  }
};

/**
 * Database health check
 */
async function healthCheck() {
  try {
    const client = getPrismaClient();
    await client.$connect();
    
    const userCount = await client.user.count();
    const rideCount = await client.ride.count();
    const activeRideCount = await client.ride.count({
      where: { isClosed: false }
    });
    
    return {
      connected: true,
      stats: {
        totalUsers: userCount,
        totalRides: rideCount,
        activeRides: activeRideCount
      }
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

module.exports = {
  getPrismaClient,
  RideDB,
  UserDB,
  BookmarkDB,
  healthCheck,
  disconnect
};
