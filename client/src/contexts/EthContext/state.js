const actions = {
    init: 'INIT',
    fetch: 'FETCH',
};

const initialState = {
    isLoaded: false,
    web3: null,
    networkID: null,
    token: null,
    crowdsale: null,
    kycVerify: null,
    addressForBuying: null,
};

const reducer = (state, action) => {
    const { type, data } = action;
    switch (type) {
        case actions.init:
            return { ...state, ...data };
        case actions.fetch:
            return { ...state, ...data };
        default:
            throw new Error('Undefined reducer action type');
    }
};

export { actions, initialState, reducer };
