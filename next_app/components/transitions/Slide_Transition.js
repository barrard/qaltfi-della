import Transition from "react-transition-group/Transition";
import React, { Fragment, Component } from "react";



export const Fade_Left = ({ show, children, key }) => {
  const duration = 300;

  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    transform: "translateX(0%)"
  };

  const transitionStyles = {
    entering: {
      opacity: 0,
      transform: "translateX(130%)"
    },
    entered: {
      display:'block',
      opacity: 1,
      transform: "translateX(0%)"
    },
    exiting:{
      opacity: 0,
      transform: "translateX(0%)"
    },
    exited:{
      // display:'none',
      opacity: 1,
      transform: "translateX(130%)"
    }
  };
  return (
    <Transition
      mountOnEnter={true}
      // appear
      unmountOnExit
      key={key} 
      in={show} 
      timeout={duration}>
      {state => {
        return (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            {children}
          </div>
        );
      }}
    </Transition>
  );
};





export const Fade_Up = ({ show, children, keyy }) => {
  // console.log({keyy})
  const duration = 300;

  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    transform: "translateY(0%)",
  };

  const transitionStyles = {
    entering: {
      opacity: 0,
      transform: "translateY(130%)",

    },
    entered: {
      // display:'block',
      opacity: 1,
      transform: "translateY(0%)",

    },
    exiting:{
      opacity: 1,
      transform: "translateY(0%)",

    },
    exited:{
      // display:'none',
      opacity: 0,
      transform: "translateY(130%)",

    }
  };
  return (
    <Transition
      // mountOnEnter={true}
      // appear={true}
      // unmountOnExit={true} 
      key={keyy} 
      in={show} 
      timeout={duration}>
      {state => {
        // console.log({key})
        // console.log(children)
   
        return (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            {children}
          </div>
        );
      }}
    </Transition>
  );
};
