import useSWR from 'swr'
import fetcher from '../utils/fetcher'

export default function useAreas() {
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