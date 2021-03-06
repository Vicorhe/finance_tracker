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

