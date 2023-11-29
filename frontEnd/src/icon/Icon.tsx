interface IconProps {
  className?: string;
}
function Icon(props: IconProps) {
  const { className } = props;
  const size = "30px";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      fill="#000"
      version="1.1"
      viewBox="0 0 612 612"
      xmlSpace="preserve"
    >
      <path d="M482.188 83.333L184.622 223.225v89.832l-51.91-23.082v-89.832L430.278 60.252l-99.946-44.439c-13.383-5.95-35.281-5.95-48.664 0L35.557 125.243C15.95 133.961-.05 158.649 0 180.107l.606 256.534c.051 21.686 16.408 46.401 36.348 54.926L282.42 596.499c12.945 5.534 34.129 5.534 47.075.003l245.55-104.936c19.939-8.521 36.297-33.234 36.348-54.919l.607-256.54c.051-21.458-15.949-46.146-35.557-54.864l-94.255-41.91zm74.21 205.342l-14.403 6.683-.292 101.353c-.013 4.429-3.925 9.701-8.727 11.773l-21.563 9.309c-4.727 2.041-8.551.149-8.554-4.223l-.073-100.021-13.951 6.472c-6.562 3.044-10.669-1.729-7.411-8.601l33.348-70.356c3.366-7.102 11.806-11.199 15.184-7.347l34.221 39.012c3.416 3.894-.92 12.765-7.779 15.946zM415.596 451.443c.037 4.243-3.55 9.24-8.001 11.162l-19.996 8.632c-4.385 1.893-7.972.029-8.022-4.16l-1.171-95.826-12.938 6.002c-6.085 2.823-9.968-1.808-7.006-8.344l30.31-66.881c3.057-6.747 10.873-10.541 14.062-6.805l32.301 37.836c3.226 3.777-.712 12.202-7.062 15.147l-13.338 6.188.861 97.049zm164.605-27.824c-.015 2.226-2.016 4.865-4.468 5.896l-228.395 95.95c-2.131.896-3.884-.043-3.915-2.096l-.175-11.162c-.032-2.058 1.67-4.463 3.805-5.372l228.802-97.467c2.455-1.046 4.438-.086 4.423 2.146l-.077 12.105z"></path>
    </svg>
  );
}

export default Icon;
