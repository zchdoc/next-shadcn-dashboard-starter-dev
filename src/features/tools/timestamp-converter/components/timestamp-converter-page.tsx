'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TimestampConverterForm } from './timestamp-converter-form';

export default function TimestampConverterPage() {
  return (
    <PageContainer>
      <div className='space-y-6'>
        <div>
          <Heading
            title='时间戳转换工具'
            description='批量将时间戳转换为人类可读的时间格式'
          />
          <Separator className='my-4' />
        </div>
        <div>
          <TimestampConverterForm />
        </div>
      </div>
    </PageContainer>
  );
}
