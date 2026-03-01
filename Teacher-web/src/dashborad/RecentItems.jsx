import React from 'react';
function RecentItems({name,presentStudents}) {
    return ( 
      <div class="flex justify-between items-center border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
       <h2 className='text-lg font-semibold px-8'>{name}</h2>
            <h2 className='text-green-500 pr-10'>{presentStudents} present</h2>
        </div>
     );
}

export default RecentItems;