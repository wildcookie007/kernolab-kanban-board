import React from 'react';
import { create } from 'react-test-renderer';
import { InitPage } from '../InitPage';
import { BoardStore } from '@app/stores/boardStore';
import { InitStore } from '@app/stores/initStore';

describe('InitPage', () => {
    let initPage: any;
    let boardStore: PartialMock<BoardStore>;
    let initStore: PartialMock<InitStore>;

    beforeEach(() => {
        boardStore = {
            loadBoard: jest.fn()
        };

        initStore = {
            setAppLoaded: jest.fn()
        };

        initPage = create(
            <InitPage boardStore={boardStore as any} initStore={initStore as any} />
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should init required functions', async () => {
        const instance = initPage.getInstance().wrappedInstance;
        instance.componentDidMount();

        expect(boardStore.loadBoard).toHaveBeenCalled();
        expect(initStore.setAppLoaded).toHaveBeenCalled();
    });
});
