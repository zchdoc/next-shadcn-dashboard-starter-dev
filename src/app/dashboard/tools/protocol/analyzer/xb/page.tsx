'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseProtocolData } from './protocol-parser';
import { ProtocolData } from './types';

export default function ProtocolAnalyzerPage() {
  const [inputData, setInputData] = useState('');
  const [protocolType, setProtocolType] = useState('consumption');
  const [parsedData, setParsedData] = useState<ProtocolData | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!inputData.trim()) {
      setError('Please enter protocol data');
      return;
    }

    if (protocolType !== 'consumption') {
      setError(
        `${getProtocolTypeLabel(protocolType)} is currently not available`
      );
      return;
    }

    try {
      const data = parseProtocolData(inputData);
      setParsedData(data);
      setError('');
    } catch (err) {
      setError(
        `Error parsing data: ${err instanceof Error ? err.message : 'Invalid format'}`
      );
      setParsedData(null);
    }
  };

  const getProtocolTypeLabel = (type: string) => {
    switch (type) {
      case 'consumption':
        return 'Consumption Data';
      case 'status':
        return 'Status Package';
      case 'subsidy':
        return 'Subsidy Request';
      default:
        return type;
    }
  };

  // Function to render a field item
  const renderFieldItem = (key: string, value: any) => (
    <div key={key} className='rounded-md border p-3'>
      <div className='font-medium'>
        {value.label} ({value.size} bytes)
      </div>
      <div className='mt-1 grid grid-cols-2 gap-2'>
        <div className='text-muted-foreground text-sm break-all'>
          Hex: {value.hex}
        </div>
        <div className='text-muted-foreground text-sm'>Dec: {value.dec}</div>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto py-6'>
      <Card className='mb-6'>
        <CardHeader className='pb-3'>
          <CardTitle>XB Protocol Analyzer</CardTitle>
          <CardDescription>
            Analyze hardware communication protocol data packets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Protocol Data (Hex)
              </label>
              <Input
                placeholder='Enter hex data packet...'
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className='font-mono'
              />
            </div>

            <div className='flex gap-4'>
              <div className='w-64'>
                <label className='mb-1 block text-sm font-medium'>
                  Device Type
                </label>
                <Select value={protocolType} onValueChange={setProtocolType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select protocol type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='consumption'>
                      Consumption Data
                    </SelectItem>
                    <SelectItem value='status'>Status Package</SelectItem>
                    <SelectItem value='subsidy'>Subsidy Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAnalyze} className='mt-6'>
                Analyze
              </Button>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {parsedData && (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Protocol data parsed successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='all'>
              <TabsList className='mb-4'>
                <TabsTrigger value='all'>All Fields</TabsTrigger>
                <TabsTrigger value='header'>Protocol Header</TabsTrigger>
                <TabsTrigger value='body'>Protocol Body</TabsTrigger>
              </TabsList>

              <ScrollArea className='h-[60vh] rounded-md border p-4'>
                <TabsContent value='all' className='mt-0 space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* CRC field at the top */}
                    {renderFieldItem('crc', parsedData.crc)}

                    {/* Header fields */}
                    <h3 className='col-span-2 mt-2 text-lg font-semibold'>
                      Protocol Header
                    </h3>
                    {Object.entries(parsedData.header).map(([key, value]) =>
                      renderFieldItem(key, value)
                    )}

                    {/* Body fields */}
                    <h3 className='col-span-2 mt-2 text-lg font-semibold'>
                      Protocol Body
                    </h3>
                    {Object.entries(parsedData.body).map(([key, value]) =>
                      renderFieldItem(key, value)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='header' className='mt-0 space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {Object.entries(parsedData.header).map(([key, value]) =>
                      renderFieldItem(key, value)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='body' className='mt-0 space-y-4'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {Object.entries(parsedData.body).map(([key, value]) =>
                      renderFieldItem(key, value)
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
