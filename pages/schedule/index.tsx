import type { NextPage } from 'next';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Head from 'next/head';

const Schedule = () => {
  return (
    <>
      <Head>
        <title>Schedule</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-9 w-2/3 border-b-2 border-black text-3xl font-medium">
          <h2>Schedule</h2>
        </div>
      </div>
      <div className="container mx-auto">
        <FullCalendar plugins={[timeGridPlugin, interactionPlugin]} editable selectable />
      </div>
    </>
  );
};

export default Schedule;
