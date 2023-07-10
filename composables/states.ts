export const getUser = () => useState<any>("firebaseUser", () => null);

export const useClientSession = () =>
  useState<Record<string, any>>("session", () => {
    return {};
  });
