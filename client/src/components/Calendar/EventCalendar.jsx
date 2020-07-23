import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {INITIAL_EVENTS, createEventId} from './event-utils'

function EventCalendar() {
    const [open, setOpen] = useState(false);
    const [currentEvents, setCurrentEvents] = useState({currentEvents: []});
    const buttonTextHeader = {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia'
    }
    const headerToolbar = {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
    const [newEvent, setNewEvent] = useState({
        id: "",
        title: "",
        start: "",
        end: "",
        allDay: false,
        startTime: "T00:00:00",
        endTime: "T00:00:00"
    });

    // -- Seleciona e salva as datas
    const selectingDates = (selectInfo) => {
        if(selectInfo.dateStr) {
            setNewEvent(preValue => ({
                ...preValue,
                start: selectInfo.dateStr,
                end: selectInfo.dateStr
            }))
        } else {
            setNewEvent(preValue => ({
                ...preValue,
                start: selectInfo.startStr,
                end: selectInfo.endStr
            }))
        }
        handleDialog();
    }

    // -- Aciona o Diálogo Formulário para edição do evento
    const handleDialog = () => { 
        setOpen(!open);
    };

    // -- Cria evento ao selecionar data
    const handleDateSelect = (selectInfo) => {
        const {title, start, end, allDay, startTime, endTime} = newEvent;
        if (title) {           
            let calendarApi = selectInfo.view.calendar
            calendarApi.unselect() // Limpa dados selecionados
        
            calendarApi.addEvent({
                id: createEventId(),
                title: title,
                start: start + startTime,
                end: end + endTime,
                allDay: allDay
            })
        }
        setOpen(false);
    }

    // -- Função ao clicar em evento já existente
    // const handleEventClick = (clickInfo) => {
    //     if (window.alert(`Tem certeza de que deseja deletar o evento '${clickInfo.event.title}'`)) {
    //         clickInfo
    //             .event
    //             .renderEventContent();
    //     }
    // }

    // -- Função de Inserção
    // const handleAddEvent = (selectInfo) => {}

    // -- Função de Remoção
    // const handleRemoveEvent = (clickInfo) => {}

    // -- Função chamada após a inserção, edição ou remoção de um evento
    const handleEvents = (events) => {
        setCurrentEvents({currentEvents: events});
    }

    return (
        <div className='calendar'>
            <FullCalendar 
                aspectRatio='0.5' 
                buttonText={buttonTextHeader} 
                contentHeight='auto' 
                dayMaxEvents={true} 
                editable={true} 
                // eventAdd={handleAddEvent}
                // eventChange={function(){}}
                // eventClick={handleEventClick}
                eventContent={renderEventContent} 
                // eventRemove={handleRemoveEvent} 
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                handleWindowResize={true} 
                headerToolbar={headerToolbar} 
                height={600} 
                initialView='dayGridMonth' 
                initialEvents={INITIAL_EVENTS} 
                locale='pt-br' 
                dateClick={selectingDates}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
                select={selectingDates}
                selectable={true} 
                selectMirror={true}
                weekends={true} 
                weekNumbers={true}/>
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