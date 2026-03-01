import React from 'react';
function HeroItems({name,logo,total,desc}) {
    return ( 
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm border-white border-l-primary w-90 bg-white">
            <div className='p-6 pb-2'>
                <span className='mr-40'>{name} </span>
                {logo}
            </div>
            <div className='p-6 pt-0'>
                <h1 className='text-3xl font-bold'>{total}</h1>
                {desc}
            </div>
           
        </div>
     );
}

export default HeroItems;