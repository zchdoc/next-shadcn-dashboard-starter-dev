'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <h2 className='text-2xl font-bold'>Something went wrong!</h2>
      <p className='text-muted-foreground mt-4'>
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={() => reset()} className='mt-4' variant='default'>
        Try again
      </Button>
    </div>
  );
}
