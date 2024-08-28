// Define the interface for the request body
export interface CreatePostRequest {
    post_id?: number;
    post_user_id: number;
    post_content: string;
    post_date: string;
    post_tag?: string;
  }
  
  // Define the interface for the response
  export interface CreatePostResponse {
    post_id: number;
    post_user_id: number;
    post_content: string;
    post_date: string;
    post_tag?: string;
  }