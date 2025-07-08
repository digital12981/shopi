import React from 'react';

const PageTitle: React.FC = () => {
  return (
    <div className="w-full bg-gray-100 py-1 px-6 flex items-center">
      <div className="flex items-center">
        <div className="mr-3">
          {/* Usando um caractere > estilizado em vez do ícone Font Awesome */}
          <span 
            style={{
              color: '#d3d3d3',
              fontSize: '28px',
              fontWeight: 900,
              display: 'inline-block',
              WebkitTextStroke: '2px #d3d3d3'
            }}
          >
            &gt;
          </span>
        </div>
        <div className="leading-none">
          <h1 className="text-base font-bold" style={{color: '#EE4D2D'}} >Motorista Parceiro</h1>
          <p className="text-sm mt-0" style={{transform: 'translateY(-2px)', color: '#EE4D2D'}}>Shopee</p>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
