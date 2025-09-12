import { YALIES_API_KEY, YALIES_API_BASE_URL } from '@env';

export interface YaliesPerson {
  netid: string;
  upi: string;
  email: string;
  mailbox: string;
  phone: string;
  fax: string;
  title: string;
  first_name: string;
  preferred_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  pronouns: string;
  phonetic_name: string;
  name_recording: string;
  address: string;
  school: string;
  school_code: string;
  year: string;
  curriculum: string;
  college: string;
  college_code: string;
  leave: string;
  visitor: string;
  image: string;
  birth_month: string;
  birth_day: string;
  major: string;
  access_code: string;
  organization: string;
  organization_code: string;
  unit_class: string;
  unit_code: string;
  unit: string;
  postal_address: string;
  office_building: string;
  office_room: string;
  cv: string;
  profile: string;
  website: string;
  education: string;
  publications: string;
}

export interface YaliesResponse {
  people: YaliesPerson[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Service for querying the Yalies API
 */
class YaliesService {
  private static instance: YaliesService;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = YALIES_API_KEY;
    this.baseUrl = YALIES_API_BASE_URL;
    
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.warn('⚠️ [YALIES] API key not configured. Please set YALIES_API_KEY in config file');
    }
  }

  static getInstance(): YaliesService {
    if (!YaliesService.instance) {
      YaliesService.instance = new YaliesService();
    }
    return YaliesService.instance;
  }

  /**
   * Query a person by their netid
   */
  async queryPersonByNetId(netid: string): Promise<{ success: boolean; person?: YaliesPerson; message: string }> {
    try {
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        return {
          success: false,
          message: 'Yalies API key not configured'
        };
      }

      const requestBody = {
        query: netid,
        filters: {
          netid: netid
        },
        page: 0,
        page_size: 10
      };

      const response = await fetch(`${this.baseUrl}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [YALIES] API request failed with status: ${response.status}`);
        console.error(`❌ [YALIES] Error response:`, errorText);
        return {
          success: false,
          message: `API request failed with status: ${response.status} - ${errorText}`
        };
      }

      const data = await response.json();
      console.log(`📄 [YALIES] Raw API response:`, JSON.stringify(data, null, 2));
      
      // Handle both array and object response formats
      let people: YaliesPerson[] = [];
      
      if (Array.isArray(data)) {
        people = data;
      } else if (data.people && Array.isArray(data.people)) {
        people = data.people;
      }
      
      if (people && people.length > 0) {
        // Look for exact netid match first
        let person = people.find(p => p.netid === netid);
        
        if (!person) {
          // If no exact match, try case-insensitive match
          person = people.find(p => p.netid?.toLowerCase() === netid.toLowerCase());
        }
        
        if (!person) {
          // If still no match, use the first result
          person = people[0];
        }
        
        return {
          success: true,
          person: person,
          message: 'Person found successfully'
        };
      } else {
        // Try a simpler query approach
        return await this.queryPersonByNetIdSimple(netid);
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Simple query approach - just use the netid as the query string
   */
  private async queryPersonByNetIdSimple(netid: string): Promise<{ success: boolean; person?: YaliesPerson; message: string }> {
    try {
      const requestBody = {
        query: netid,
        page: 0,
        page_size: 10
      };

      const response = await fetch(`${this.baseUrl}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [YALIES SIMPLE] API request failed with status: ${response.status}`);
        console.error(`❌ [YALIES SIMPLE] Error response:`, errorText);
        return {
          success: false,
          message: `Simple query failed with status: ${response.status} - ${errorText}`
        };
      }

      const data = await response.json();
      console.log(`📄 [YALIES SIMPLE] Raw API response:`, JSON.stringify(data, null, 2));
      
      // Handle both array and object response formats
      let people: YaliesPerson[] = [];
      
      if (Array.isArray(data)) {
        people = data;
      } else if (data.people && Array.isArray(data.people)) {
        people = data.people;
      }
      
      if (people && people.length > 0) {
        // Look for exact netid match
        let person = people.find(p => p.netid === netid);
        
        if (!person) {
          // If no exact match, try case-insensitive match
          person = people.find(p => p.netid?.toLowerCase() === netid.toLowerCase());
        }
        
        if (!person) {
          // If still no match, use the first result
          person = people[0];
        }
        
        return {
          success: true,
          person: person,
          message: 'Person found successfully with simple query'
        };
      } else {
        return {
          success: false,
          message: 'No person found with simple query'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error in simple query'
      };
    }
  }
}

export default YaliesService;
