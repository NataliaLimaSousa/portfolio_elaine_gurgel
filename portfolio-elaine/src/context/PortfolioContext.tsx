"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PortfolioData } from "@/lib/types";

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateDataLocally: (newData: PortfolioData) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/content", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Erro ao atualizar dados do portfólio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDataLocally = (newData: PortfolioData) => {
    setData(newData);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json) {
          setData(json);
        }
      })
      .catch((err) => console.error("Erro ao carregar conteúdo:", err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        refreshData,
        updateDataLocally,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio deve ser usado dentro de um PortfolioProvider");
  }
  return context;
}
