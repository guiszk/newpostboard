const animateCSS = (element, animation, prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });


function posttoggle(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
}

function inputcheck() {
    var usrinput = document.getElementsByClassName('userinput')[0].value;
    var textinput = document.getElementsByClassName('textinput')[0].value;
    var postbutton = document.getElementsByClassName('postbutton')[0];
    if(usrinput == '' || textinput == '') {
        postbutton.type = 'button';
        animateCSS('.postbutton', 'headShake');
    } else {
        postbutton.type = 'submit';
        animateCSS('.postbutton', 'flipOutX');
    }
}
