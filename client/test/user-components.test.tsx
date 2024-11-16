import * as React from 'react';
import { UserProfile, UserSettings } from '../src/components/user-components';
import { Link } from 'react-router-dom';
import userService from '../src/services/user-service';
import type { User } from '../src/services/user-service';
import { shallow } from 'enzyme';
