export const Block_Spinner = ()=>(
  <div className="sk-cube-grid">
  <div className="sk-cube sk-cube1"></div>
  <div className="sk-cube sk-cube2"></div>
  <div className="sk-cube sk-cube3"></div>
  <div className="sk-cube sk-cube4"></div>
  <div className="sk-cube sk-cube5"></div>
  <div className="sk-cube sk-cube6"></div>
  <div className="sk-cube sk-cube7"></div>
  <div className="sk-cube sk-cube8"></div>
  <div className="sk-cube sk-cube9"></div>
  <style jsx>
  {`
  .sk-cube-grid {
    width: 40px;
    height: 40px;
    margin-bottom:1rem;
    margin-left:1rem;
  }
  
  .sk-cube-grid .sk-cube {
    width: 33%;
    height: 33%;
    float: left;
    -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
            animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 
  }

  .sk-cube-grid .sk-cube1 {

    background-color: #4c7a40;
  }
  .sk-cube-grid .sk-cube2 {

    background-color: #5d8753;
  }
  .sk-cube-grid .sk-cube3 {

    background-color: #6f9466;
  }
  .sk-cube-grid .sk-cube4 {

    background-color: #a5bc9f;
  }
  .sk-cube-grid .sk-cube5 {

    background-color: #a5bc9f;
  }
  .sk-cube-grid .sk-cube6 {

    background-color: #5d8753;
  }
  .sk-cube-grid .sk-cube7 {

    background-color: #c9d7c5;
  }
  .sk-cube-grid .sk-cube8 {

    background-color: #a5bc9f;
  }
  .sk-cube-grid .sk-cube9 {

    background-color: #4c7a40;
  }
  
  .sk-cube-grid .sk-cube1 {
    -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s; }
  .sk-cube-grid .sk-cube2 {
    -webkit-animation-delay: 0.3s;
            animation-delay: 0.3s; }
  .sk-cube-grid .sk-cube3 {
    -webkit-animation-delay: 0.4s;
            animation-delay: 0.4s; }
  .sk-cube-grid .sk-cube4 {
    -webkit-animation-delay: 0.1s;
            animation-delay: 0.1s; }
  .sk-cube-grid .sk-cube5 {
    -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s; }
  .sk-cube-grid .sk-cube6 {
    -webkit-animation-delay: 0.3s;
            animation-delay: 0.3s; }
  .sk-cube-grid .sk-cube7 {
    -webkit-animation-delay: 0s;
            animation-delay: 0s; }
  .sk-cube-grid .sk-cube8 {
    -webkit-animation-delay: 0.1s;
            animation-delay: 0.1s; }
  .sk-cube-grid .sk-cube9 {
    -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s; }
  
  @-webkit-keyframes sk-cubeGridScaleDelay {
    0%, 70%, 100% {
      -webkit-transform: scale3D(1, 1, 1);
              transform: scale3D(1, 1, 1);
    } 35% {
      -webkit-transform: scale3D(0, 0, 1);
              transform: scale3D(0, 0, 1); 
    }
  }
  
  @keyframes sk-cubeGridScaleDelay {
    0%, 70%, 100% {
      -webkit-transform: scale3D(1, 1, 1);
              transform: scale3D(1, 1, 1);
    } 35% {
      -webkit-transform: scale3D(0, 0, 1);
              transform: scale3D(0, 0, 1);
    } 
  }
  `}
</style>
</div>
)