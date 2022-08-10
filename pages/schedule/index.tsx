// @fullcalendar/react should always be on top, before plugins
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import Heading from '../../components/common/Heading';
import Loading from '../../components/common/Loading';
import {
  CalendarEvent,
  CalendarOrder,
  CalendarRecurEvent,
  DbAvailability,
} from '../../models/ScheduleModels';
import { supabase } from '../../utils/supabaseClient';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { PlusSmIcon, RefreshIcon } from '@heroicons/react/outline';
import Modal from '../../components/modals/Modal';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const Schedule = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<CalendarEvent[] | any[]>([]);
  const [availabilities, setAvailabilities] = useState<CalendarRecurEvent[] | any[]>([]);
  const [loading, setLoading] = useState(true);
  // Dialog
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalDesc, setModalDesc] = useState<string>('');
  // New Availabilities
  const [newAvailability, setNewAvailability] = useState<DbAvailability | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Calendar
  const calendar = useRef<any>(null);

  useEffect(() => {
    getEvents();
  }, [user]);

  const getOrdersForCalendar = async (status: string[]) => {
    try {
      const response = await axios.get(`/api/schedule-management/orders/${status}`);

      return response.data.orders;
    } catch (error) {
      console.error(error);
    }
  };

  async function getEvents() {
    try {
      setUser(supabase.auth.user());

      if (user) {
        // Fetch Chef's Availability
        const { data: availData, error: fetchAvailError } = await supabase
          .from('HomeChef_Availability')
          .select()
          .eq('homechef_id', user.id);

        if (fetchAvailError) {
          throw fetchAvailError.message;
        }

        if (availData) {
          const dbAvailabilities = availData as DbAvailability[];

          // map dbAvailabilities to CalendarRecurEvent[]
          const availabilities: CalendarRecurEvent[] = dbAvailabilities.map((dbAvailability) => {
            return {
              // title: `Available from ${dbAvailability.startTime} to ${dbAvailability.endTime}`,
              daysOfWeek: dbAvailability.daysOfWeek,
              // startTime: dbAvailability.startTime,
              // endTime: dbAvailability.endTime,
              startRecur: dbAvailability.startRecur,
              endRecur: dbAvailability.endRecur,
              allDay: true,
              display: 'background',
              color: 'green',
            };
          });

          setAvailabilities(availabilities);
        }

        // Fetch Fulfilled or Ongoing orders for Calendar
        const calendarOrders: CalendarOrder[] = await getOrdersForCalendar(['O', 'F']);
        if (calendarOrders) {
          const orders: CalendarEvent[] = calendarOrders.map((calendarOrder: CalendarOrder) => {
            console.log(calendarOrder);
            return {
              title:
                calendarOrder.status === 'F'
                  ? `Fulfilled #${calendarOrder.id.toString()} - ${calendarOrder.Consumer.name}`
                  : `Ongoing #${calendarOrder.id.toString()} - ${calendarOrder.Consumer.name}`,
              start: calendarOrder.time,
              color: calendarOrder.status === 'F' ? '#EB4747' : '#3788d8',
            };
          });
          setOrders(orders);
        }

        // When all events for calendar are ready
        if (availabilities && orders) {
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
        <Heading
          title={'Schedule'}
          optionalNode={
            <>
              <button
                className="mr-2 rounded-md bg-[#2c3e51] px-1 py-1 text-base font-normal text-white hover:bg-[#1b252f] focus:ring-4 focus:ring-[#b3b3b3] disabled:bg-[#76828e]"
                onClick={() => window.location.reload()}
              >
                <RefreshIcon className="h-8 w-8 stroke-2 p-1" />
              </button>
              <button
                className="rounded-md bg-[#2c3e51] px-3 py-1 text-base font-normal text-white hover:bg-[#1b252f] focus:ring-4 focus:ring-[#b3b3b3] disabled:bg-[#76828e]"
                disabled={newAvailability ? false : true}
                onClick={() => {
                  if (!newAvailability) return;
                  const events = calendar.current.getApi().getEvents();
                  let isValid = true;

                  for (let i = 0; isValid && i < events.length; ++i) {
                    if (
                      events[i].start >= newAvailability.startRecur &&
                      events[i].start < newAvailability.endRecur
                    )
                      isValid = false;
                  }

                  if (isValid) {
                    axios
                      .post('/api/schedule-management/availability', {
                        availability: newAvailability,
                      })
                      .then((response) => {
                        setNewAvailability(null);
                      })
                      .catch((err) => {
                        console.error('Server Error: Cannot Add Availabilities');
                      });
                  } else {
                    setShowConfirmModal(true);
                  }
                }}
              >
                <div className="flex items-center justify-items-center">
                  <PlusSmIcon className="h-8 w-8 stroke-2 pr-2" />
                  <span>add availability</span>
                </div>
              </button>
            </>
          }
          optionalNodeRightAligned={true}
        />

        {loading ? (
          <Loading />
        ) : (
          <>
            <Modal
              visible={showConfirmModal}
              title={'Invalid Date Selection'}
              content={
                <p className="mx-2 mb-4 break-words text-center text-lg">
                  Selected dates already contain event(s)!
                </p>
              }
              rightBtnText={'OK'}
              rightBtnOnClick={() => setShowConfirmModal(false)}
              hideLeftBtn={true}
            />
            <FullCalendar
              ref={calendar}
              //include this if using any premium plugins
              // schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
              plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
              // views={{ timeGrid: { height: 'auto' } }}
              initialView="dayGridMonth"
              height={'auto'}
              slotMinTime={'8:00:00'}
              slotMaxTime={'22:00:00'}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
              }}
              events={[...availabilities, ...orders]}
              eventClick={(info) => {
                if (info.event.display !== 'background') {
                  setModalTitle(`${info.event.start?.toDateString()}`);
                  setModalDesc(`${info.event.start?.toLocaleTimeString()} ${info.event.title}`);
                  setIsOpen(true);
                }
              }}
              stickyHeaderDates={true}
              nowIndicator={true}
              dayMaxEventRows={2} //"+ more" link when more than 2 event rows per day
              allDaySlot={false}
              slotEventOverlap={false}
              editable={true}
              selectable={true}
              selectMinDistance={1} // eventClick for background event
              unselectAuto={false}
              select={(info) => {
                let minDate = new Date();
                minDate.setDate(minDate.getDate() - 1);

                if (info.start < minDate) {
                  info.view.calendar.unselect();
                  return;
                }

                const date = new Date(info.start);
                const daysOfWeek = [];

                for (let i = 0; i < 7 && date < info.end; i++) {
                  daysOfWeek.push(date.getDay());
                  date.setDate(date.getDate() + 1);
                }

                setNewAvailability({
                  daysOfWeek: daysOfWeek,
                  startTime: info.start.toTimeString().split(' ')[0],
                  endTime: info.end.toTimeString().split(' ')[0],
                  startRecur: info.start,
                  endRecur: info.end,
                });
              }}
            />
          </>
        )}

        <Dialog className="relative z-50" open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Dialog.Panel className="rounded-2xl bg-white p-6">
              <Dialog.Title as="h3" className="text-lg font-medium text-gray-800">
                {modalTitle}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-900">
                {modalDesc}
              </Dialog.Description>
            </Dialog.Panel>
          </div>
        </Dialog>
      </main>
    </>
  );
};

export default Schedule;
