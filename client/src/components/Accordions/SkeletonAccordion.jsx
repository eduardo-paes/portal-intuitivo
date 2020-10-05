import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const AccordionSkeleton = () => {
    return (
      <div style={{padding: '0 0.5rem', width: '100%'}}>
        <Skeleton animation="wave" height={130} />
        <Skeleton animation="wave" height={130} />
        <Skeleton animation="wave" height={130} />
      </div>
    )
  }

export default AccordionSkeleton;