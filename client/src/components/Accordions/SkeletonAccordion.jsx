import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const AccordionSkeleton = (num) => {
  const retSkeletons = () => {
    var array = [];
    for (let index = 0; index < num; index++) {
      array.push(<Skeleton key={index} animation="wave" height={130} />)
    }
    return array;
  }
  return (
    <div style={{padding: '0 0.5rem', width: '100%'}}>
      { retSkeletons() }
    </div>
  )
}

export default AccordionSkeleton;