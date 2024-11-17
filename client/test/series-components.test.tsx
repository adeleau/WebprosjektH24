import * as React from 'react';
import { SeriesList } from '../src/components/series-components';
import { Link } from 'react-router-dom';
import seriesService from '../src/services/series-service';
import type { Series } from '../src/services/series-service';
import { shallow } from 'enzyme';
