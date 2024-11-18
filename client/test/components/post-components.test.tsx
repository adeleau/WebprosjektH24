import * as React from 'react';
import { PostList, PostDetails, PostNew, PostEdit } from '../../src/components/post-components';
import { Link } from 'react-router-dom';
import postService from '../../src/services/post-service';
import type { Post, PostComment/*, PostLike*/ } from '../../src/services/post-service';
import { shallow } from 'enzyme';

