import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader';

import './styles/global.scss';
import { Index } from './components';

import { providers } from './services/providers';

const render = (Component: React.ComponentClass) => {
    ReactDOM.render(
        (
            <AppContainer>
                <Provider {...providers}>
                    <Component />
                </Provider>
            </AppContainer>
        ),
        document.getElementById('root')
    );
};

render(Index);

if (module['hot']) {
    module['hot'].accept('./components/index', () => render(Index));
}
