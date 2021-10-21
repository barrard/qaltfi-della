export const Spinner = ({msg}) =>(

  
  <div id="spinner">
    <div id="loading">
        <div id="spinner"></div>
        <div id="loading_text">{msg}</div>
        <style jsx>{`

#loading {
  z-index:14;
  color:#00FFA6;
  position:fixed;
  top:0;left:0;
  width:100%;
  height:100%;
  background:#303030;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center; 
  opacity: 0.7;
  /* animation: slow_fade 6s linear infinite;  */

}

@keyframes spin {
  from {
    transform:rotate(0deg);
    /* opacity: 0.1; */
    }
  to {
    transform:rotate(360deg);
    /* opacity: 0.9; */
  }
}
#loading #spinner {
  z-index: 10000;
  width:100px;
  height:100px;
  margin-bottom:30px;
  border:5px solid #00FFA6;
  border-top-color:transparent;
  border-radius:50%;
  animation: spin 1s linear infinite; 
}
`}</style>
 
    </div>
    
</div>

)