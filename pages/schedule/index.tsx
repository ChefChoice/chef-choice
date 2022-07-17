import type { NextPage } from 'next';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import Head from 'next/head';
import Heading from '../../components/common/Heading';
import { supabase } from '../../utils/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { DbAvail as DbAvailability, CalendarRecurEvent } from '../../models/Availability';
import Loading from '../../components/common/Loading';

const Schedule = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState(null);
  const [availabilities, setAvailabilities] = useState<CalendarRecurEvent[] | any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailability();
  }, [user]);

  async function getAvailability() {
    try {
      setUser(supabase.auth.user());

      if (user) {
        const { data, error } = await supabase
          .from('HomeChef_Availability')
          .select()
          .eq('homechef_id', user.id);

        if (error) throw error.message;

        if (data) {
          const dbAvailabilities = data as DbAvailability[];

          // map dbAvailabilities to CalendarRecurEvent[]
          const availabilities: CalendarRecurEvent[] = dbAvailabilities.map((dbAvailability) => {
            return {
              daysOfWeek: dbAvailability.daysOfWeek,
              startTime: dbAvailability.startTime,
              endTime: dbAvailability.endTime,
              startRecur: dbAvailability.startRecur,
              endRecur: dbAvailability.endRecur,
              display: 'background',
            };
          });

          setAvailabilities(availabilities);
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Head>
        <title>Schedule</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex h-full w-full flex-col py-20 px-10">
        <Heading title={'Schedule'} />

        {loading ? (
          <Loading />
        ) : (
          <FullCalendar
            //include this if using any premium plugins
            // schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            views={{ listDay: { buttonText: 'day' } }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listDay',
            }}
            editable={true}
            selectable={true}
            events={availabilities}
          />
        )}
      </main>
    </>
  );
};

export default Schedule;
