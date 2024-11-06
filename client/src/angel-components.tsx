import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
const { angelService, collectionService, postService } = services;
import services, { Sonny_Angel, Post } from './angel-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * Renders angel list.
 */
export class AngelList extends Component {
  angels: Sonny_Angel[] = [];

  render() {
    return (
      <>
        <Card title="Sonny Angel collection">
          {this.angels.map((angel) => (
            <Row key={angel.angel_id}>
              <Column>
                <NavLink to={'/angels/' + angel.angel_id}>{angel.name}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
        {/* <Button.Success onClick={() => history.push('/angels/new')}>New Sonny Angel</Button.Success> */}
      </>
    );
  }

  mounted() {
    angelService
      .getAll()
      .then((angels) => (this.angels = angels))
      .catch((error) => Alert.danger('Error getting angels: ' + error.message));
  }
}

/**
 * Renders a specific angel.
 */
export class AngelDetails extends Component<{ match: { params: { angel_id: number } } }> {
  angel: Sonny_Angel = { angel_id: 0, collection_id: 0, name: '', description: '', image: '' };

  render() {
    return (
      <>
        <Card title={this.angel.name}>
          <Row>
            <Column width={2}>Name:</Column>
            <Column>{this.angel.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Collection:</Column>
            <Column>{this.angel.collection_id}</Column>
          </Row>
          <Row>
            <Column width={2}>Description:</Column>
            <Column>{this.angel.description}</Column>
          </Row>
          <Row>
            <Column width={2}>Image:</Column>
            <Column>
              <img src={this.angel.image} style={{ maxWidth: '200px', maxHeight: '200px' }}></img>
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/angels/' + this.props.match.params.angel_id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  mounted() {
    angelService
      .get(this.props.match.params.angel_id)
      .then((angel) => (this.angel = angel))
      .catch((error) => Alert.danger('Error getting angel: ' + error.message));
  }
}

export class PostList extends Component {
  posts: Post[] = [];

  render() {
    return (
      <>
        <Card title="Community">
          {this.posts.map((post) => (
            <Row key={post.post_id}>
              <Column>
                <NavLink to={'/posts/' + post.post_id}>{post.title}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/posts/new')}>New post</Button.Success>
      </>
    );
  } 

  mounted() {
    postService
      .getAll()
      .then((posts) => (this.posts = posts))
      .catch((error) => Alert.danger('Error getting posts: ' + error.message));
  }
}

/**
 * Renders a specific post.
 */
export class PostDetails extends Component<{ match: { params: { post_id: number } } }> {
  post: Post = { post_id: 0, user_id:0, title: '', content: '', img: '' };
  newCommentText = '';
  state = {
    like_count: 0,
    isLiked: false,
    loading: true,
  }

  mounted() {
    postService
      .get(this.props.match.params.post_id)
      .then((post) => {
        this.post = post; 
        this.setState({ loading: false });
      })
      .catch((error) => Alert.danger('Error getting post: ' + error.message));
    this.getLikeCount();
  }

  getLikeCount() {
    postService
      .getPosLikes(this.props.match.params.post_id)
      .then((like_count) => {
        this.setState({ like_count })
      })
      .catch((error) => Alert.danger('Error getting like count: ' + error.message));
  }

  toggleLike = () => {
    const { isLiked, like_count } = this.state;
    this.setState(
      {
        like_count: isLiked ? like_count - 1 : like_count + 1,
        isLiked: !isLiked,
      },
      () => {
        postService
          .likePost(this.props.match.params.post_id)
          .catch((error) => Alert.danger('Error updating like count'))
      }
    )
  }

  render() {
    const { like_count, isLiked, loading } = this.state;
    if (loading) {
      return <p>Loading...</p>
    }
    return (
      <>
        <Card title={this.post.title}>
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.post.title}</Column>
          </Row>
          <Row>
            <Column width={2}>Content:</Column>
            <Column>{this.post.content}</Column>
          </Row>
          <Row>
            <Column width={2}>Image:</Column>
            <Column>
              <img src={this.post.img} style={{ maxWidth: '200px', maxHeight: '200px' }}></img>
            </Column>
          </Row>
          <Row>
            <Column width={2}>Likes</Column>
            <Column>
              <Button.Success onClick={this.toggleLike}>{isLiked ? "Dislike" : "Like"}</Button.Success>
                <span id="like-count"> {like_count} like(s)</span>
            </Column>
          </Row>
          <Row>
            <Column width={2}>Comments:</Column>
            {/* <Column>
              {this.post.comments.map((comment, index) => ( //////////////////////////////////////////////
                <div key={index}>
                  <strong>{comment.user}:</strong> {comment.text}
                </div>
              ))}
              <Form.Input
                type="text"
                value={this.newCommentText}
                placeholder="Add a comment"
                onChange={(event) => (this.newCommentText = event.currentTarget.value)}
              />
              <Button.Success onClick={() => this.addComment()}>Add Comment</Button.Success>
            </Column> */}
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/posts/' + this.props.match.params.post_id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    );
  }

  

  // addComment() {
  //   if (this.newCommentText.trim()) {
  //     this.post.comments.push({ user: 'Current User', text: this.newCommentText });
  //     this.newCommentText = '';  
  //     this.forceUpdate();  
  //   }
  // }
}

/**
 * Renders form to edit a specific post.
 */
export class PostEdit extends Component<{ match: { params: { post_id: number } } }> {
  post: Post = { post_id: 0, user_id: 0, title: '', content: '', img: ''};

  render() {
    return (
      <>
        <Card title="Edit post">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.post.title}
                onChange={(event) => (this.post.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Content:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.post.content}
                onChange={(event) => (this.post.content = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Image:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.post.img}
                onChange={(event) => (this.post.img = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() =>
                postService
                  .updatePost(this.post.post_id, this.post.title, this.post.content, this.post.img)
                  .then(() => {
                    history.push('/posts/' + this.post.post_id);
                  })
                  .catch((error) => Alert.danger('Error updating post: ' + error.message))
              }
            >
              Save
            </Button.Success>
          </Column>
          <Column right>
            <Button.Danger
              onClick={() => {
                postService
                  .deletePost(this.post.post_id)
                  .then(() => {
                    history.push('/posts'); // Gå tilbake til postlisten etter sletting
                  })
                  .catch((error) => Alert.danger('Error deleting post: ' + error.message));
              }}
            >
              Delete
            </Button.Danger>
          </Column>
        </Row>
      </>
    );
  }

  mounted() {
    postService
      .get(this.props.match.params.post_id)
      .then((post) => (this.post = post))
      .catch((error) => Alert.danger('Error getting post: ' + error.message));
  }
}

/**
 * Renders form to create new post.
 */
export class PostNew extends Component {
  title = '';
  content = '';
  img = '';
  user_id = 0;

  render() {
    return (
      <>
        <Card title="New post">
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>By:</Form.Label>
            </Column>
            <Column>
            <Form.Select
              value={this.user_id}
              onChange={(event) => (this.user_id = Number(event.currentTarget.value))}
            >
              <option value="">Select a user</option>
              <option value="2">Jub</option>
            </Form.Select>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Content:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.content}
                onChange={(event) => (this.content = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Image:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.img}
                onChange={(event) => (this.img = event.currentTarget.value)}
                rows={10}
              />
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => {
            postService
              .create(this.title, this.user_id, this.content, this.img)
              .then((post_id) => history.push('/posts/' + post_id))
              .catch((error) => Alert.danger('Error creating post: ' + error.message));
          }}
        >
          Create
        </Button.Success>
      </>
    );
  }
}