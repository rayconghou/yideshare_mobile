import { User } from './CASService';
import { BACKEND_URL } from '../config/backend';

export interface Ride {
  id: string;
  driver: {
    name: string;
    email: string;
    phone: string;
    initials: string;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  note: string;
  createdAt: string;
  isBookmarked?: boolean;
}

export interface BookmarkResponse {
  success: boolean;
  isBookmarked: boolean;
  message?: string;
}

export interface RidesResponse {
  success: boolean;
  rides: Ride[];
}

class RideService {
  private static instance: RideService;
  private baseUrl = `${BACKEND_URL}/api`;

  static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  /**
   * Fetch all available rides
   */
  async getRides(): Promise<Ride[]> {
    try {
      const response = await fetch(`${this.baseUrl}/rides`);
      const data: RidesResponse = await response.json();
      
      if (data.success) {
        return data.rides;
      } else {
        throw new Error('Failed to fetch rides');
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      throw error;
    }
  }

  /**
   * Fetch user's bookmarked rides
   */
  async getBookmarkedRides(user: User): Promise<Ride[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bookmarks?netid=${user.netid}`);
      const data: RidesResponse = await response.json();
      
      if (data.success) {
        // All rides in bookmarked list should have isBookmarked: true
        return data.rides.map(ride => ({
          ...ride,
          isBookmarked: true
        }));
      } else {
        throw new Error('Failed to fetch bookmarked rides');
      }
    } catch (error) {
      console.error('Error fetching bookmarked rides:', error);
      throw error;
    }
  }

  /**
   * Toggle bookmark for a ride
   */
  async toggleBookmark(user: User, rideId: string): Promise<BookmarkResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          netid: user.netid,
          rideId: rideId,
        }),
      });
      
      const data: BookmarkResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  /**
   * Check if a ride is bookmarked by user
   */
  async isRideBookmarked(user: User, rideId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/bookmarks/check?netid=${user.netid}&rideId=${rideId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.isBookmarked;
      } else {
        throw new Error('Failed to check bookmark status');
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }

  /**
   * Fetch rides with bookmark status for a user
   */
  async getRidesWithBookmarkStatus(user: User): Promise<Ride[]> {
    try {
      const rides = await this.getRides();
      
      // Check bookmark status for each ride
      const ridesWithBookmarkStatus = await Promise.all(
        rides.map(async (ride) => {
          const isBookmarked = await this.isRideBookmarked(user, ride.id);
          return {
            ...ride,
            isBookmarked,
          };
        })
      );
      
      return ridesWithBookmarkStatus;
    } catch (error) {
      console.error('Error fetching rides with bookmark status:', error);
      throw error;
    }
  }
}

export default RideService;
