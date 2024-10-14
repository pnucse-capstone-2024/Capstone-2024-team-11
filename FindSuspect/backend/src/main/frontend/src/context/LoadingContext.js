import React, { createContext, useState, useContext } from 'react';

// Context 생성
const LoadingContext = createContext();

// Hook을 통해 Context에 접근할 수 있게 해줌
export const useLoadingState = () => useContext(LoadingContext);

// Provider를 통해 상태를 자식 컴포넌트에 제공
export const LoadingContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
