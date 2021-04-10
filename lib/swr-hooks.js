import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json());

export function useUsers() {
  const { data, error } = useSWR(
    "/api/user/get-all",
    fetcher
  );
  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useAreas() {
  const { data, error } = useSWR(
    "/api/area/get-all",
    fetcher
  );
  return {
    areas: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useAccounts() {
  const { data, error } = useSWR(
    "/api/account/get-all",
    fetcher
  );
  return {
    areas: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useItems() {
  const { data, error } = useSWR(
    "/api/item/get-all",
    fetcher
  );
  return {
    areas: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useTransactions(user_id){
  return useSWR(`/api/transaction/get-all?user_id=${user_id}`, fetcher)
}