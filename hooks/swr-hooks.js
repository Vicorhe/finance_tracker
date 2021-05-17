import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json());

export function useUsers() {
  const { data, error } = useSWR(
    "/api/user/get-all",
    fetcher
  );
  return {
    users: data,
    isUsersLoading: !error && !data,
    isUsersError: error,
  }
}

export function useAreas() {
  const { data, error } = useSWR(
    "/api/area/get-all",
    fetcher
  );
  return {
    areas: data,
    isAreasLoading: !error && !data,
    isAreasError: error,
  }
}

export function useAccounts() {
  const { data, error } = useSWR(
    "/api/account/get-all",
    fetcher
  );
  return {
    accounts: data,
    isAccountsLoading: !error && !data,
    isAccountsError: error,
  }
}

export function useItems() {
  const { data, error } = useSWR(
    "/api/item/get-all",
    fetcher
  );
  return {
    items: data,
    isItemsLoading: !error && !data,
    isItemsError: error,
  }
}

export function useTransactions(user_id){
  const { data, error } = useSWR(
    `/api/transaction/get-all?user_id=${user_id}`,
    fetcher
  );
  return {
    transactions: data,
    isTransactionsLoading: !error && !data,
    isTransactionsError: error,
  }
}