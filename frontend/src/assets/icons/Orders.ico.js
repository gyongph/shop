const OrdersIcon = ({path,colorA,colorB}) => {
    const currentPath = document.location.pathname;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0,0h24v24H0V0z" fill="none" />
      <g fill={currentPath===path ? colorA : colorB}>
        <path d="M19.5,3.5L18,2l-1.5,1.5L15,2l-1.5,1.5L12,2l-1.5,1.5L9,2L7.5,3.5L6,2v14H3v3c0,1.66,1.34,3,3,3h12c1.66,0,3-1.34,3-3V2 L19.5,3.5z M15,20H6c-0.55,0-1-0.45-1-1v-1h10V20z M19,19c0,0.55-0.45,1-1,1s-1-0.45-1-1v-3H8V5h11V19z" />
        <rect height="2" width="6" x="9" y="7" />
        <rect height="2" width="2" x="16" y="7" />
        <rect height="2" width="6" x="9" y="10" />
        <rect height="2" width="2" x="16" y="10" />
      </g>
    </svg>
  );
};


export default OrdersIcon;