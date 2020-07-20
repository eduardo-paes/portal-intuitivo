import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {INITIAL_EVENTS, createEventId} from './event-utils'

function EventCalendar () {
    const [currentEvents, setCurrentEvents] = useState({
        currentEvents: []
    })
    const buttonTextHeader = {
        today:    'Hoje',
        month:    'Mês',
        week:     'Semana',
        day:      'Dia'
    }

    // -- Cria evento ao selecionar data
    const handleDateSelect = (selectInfo) => {
        let title = prompt('Título do evento:')
        let calendarApi = selectInfo.view.calendar

            calendarApi.unselect() // clear date selection

        if (title) {
            calendarApi.addEvent(
                {
                    id: createEventId(), 
                    title, 
                    start: selectInfo.startStr, 
                    end: selectInfo.endStr, 
                    allDay: selectInfo.allDay
                }
            )
        }
    }
    
    // -- Função ao clicar em evento já existente
    const handleEventClick = (clickInfo) => {
        if (window.alert(`Tem certeza de que deseja deletar o evento '${clickInfo.event.title}'`)) {
            clickInfo.event.renderEventContent();
        }
    }

    const handleAddEvent = (clickInfo) => {
        console.log('Add:', clickInfo);
    }

    const handleRemoveEvent = (clickInfo) => {
        console.log('Rem:', clickInfo);
    }

    const handleEvents = (events) => {
        setCurrentEvents({currentEvents: events})
    }

    return (
        <div className='calendar'>
            <FullCalendar 
                aspectRatio='2'
                buttonText={buttonTextHeader}
                contentHeight='auto'
                dayMaxEvents={true} 
                editable={true} 
                eventAdd={handleAddEvent}
                // eventChange={function(){}}
                eventClick={handleEventClick} // custom render function
                eventContent={renderEventContent}
                eventRemove={handleRemoveEvent}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                handleWindowResize={true} 
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }} 
                initialView='dayGridMonth' 
                initialEvents={INITIAL_EVENTS}
                locale='pt-br'
                plugins={[
                    dayGridPlugin, 
                    timeGridPlugin, 
                    interactionPlugin                        
                    ]} 
                select={handleDateSelect} // alternatively, use the `events` setting to fetch from a feed
                selectable={true} 
                selectMirror={true} 
                themeSystem='jquery-ui'
                weekends={true}
                weekNumbers={true}
            />
            {/* {console.log(currentEvents)} */}
        </div>
    )
}

function renderEventContent(eventInfo) {
    return (
        <div>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </div>
    )
}

export default EventCalendar;