import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFetchPhotoHistory() {
  const { data, error, isLoading, mutate } = useSWR('/api/photo-history', fetcher);

  return {
    photoHistory: data || [],
    isLoading,
    isError: error,
    mutate, // to revalidate after add/update/delete
  };
}
