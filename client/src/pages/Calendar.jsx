import React from "react";
import {MyContainer, MyCard} from "../styles/styledComponents"

// -- FullCalendar
import EventCalendar from '../components/EventCalendar'

const Calendar = props => {
  
  return (
    <MyContainer>
      <h1 className="heading-page">Calendário</h1>
        <MyCard>
          <EventCalendar/>
        </MyCard>
    </MyContainer>
  );
};

export default Calendar;
