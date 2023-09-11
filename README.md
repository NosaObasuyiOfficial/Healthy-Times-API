This is a Blog API using Node.js + TypeScript, with a postgres Database.

Blog Name - HealthyTimes

To perform any operation, you  must first;
1. User Signup - localhost:PORT/user/signup
2. User Verification - localhost:PORT/user/confirmation/:signup_token
3. User Login - localhost:PORT/user/login

Users can be able to;
1. Get all blog posts - localhost:PORT/post/all_posts
   Get all posts with search - localhost:PORT/post/all_posts/search

2. Get a single post - localhost:PORT/post/posts

3. Add a post - localhost:PORT/post/create_post

4. Like a post - localhost:PORT/post/likes

5. Comment on a post - localhost:PORT/post/comments

6. Edit a post - localhost:PORT/post/post_update

7. Delete a post - localhost:PORT/post/delete

Note Pagination and search function were added.