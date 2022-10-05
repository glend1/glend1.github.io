window.onload = function () {
  const profileLink = document.querySelector('#profile-link');
  const experiance = document.querySelector('#experiance');
  const experianceLink = document.querySelector('#experiance-link');
  const education = document.querySelector('#education');
  const educationLink = document.querySelector('#education-link');
  const skills = document.querySelector('#skills');
  const skillsLink = document.querySelector('#skills-link');
  const portfolio = document.querySelector('#portfolio');
  const portfolioLink = document.querySelector('#portfolio-link');
  const linksLink = document.querySelector('#links-link');
  const navigationMenu = document.querySelector('#menu-img');
  const navigation = document.querySelector('nav');
  const navigationlink = document.querySelector('nav ul a');

  /**
    * checks if the display would match that of a mobile.
    * @return {boolean} if the browser is mobile resolution
    */
  function isMobile() {
    return window.getComputedStyle(navigationMenu).display == 'none' ?
      false :
      true;
  };

  navigationlink.addEventListener('click', function (e) {
    if (isMobile()) toggleMenu();
  });

  window.addEventListener('scroll', function (e) {
    // the +1 is because the scroll value is a pixel off
    if (isMobile()) {
      navigation.classList.remove('visible');
    };
    const de = document.documentElement;
    const currentPos = de.scrollTop + 1;
    if (currentPos < experiance.offsetTop) {
      setClass(profileLink);
    } else if (currentPos < education.offsetTop) {
      setClass(experianceLink);
    } else if (currentPos < skills.offsetTop) {
      setClass(educationLink);
    } else if (currentPos < portfolio.offsetTop) {
      setClass(skillsLink);
    } else if (window.innerHeight + de.scrollTop == de.offsetHeight) {
      setClass(linksLink);
    } else {
      setClass(portfolioLink);
    }
  });

  /**
    * deselects the currently selected element and selects the parameter
    * @param {object} currentElement the element that will be selected.
    */
  function setClass(currentElement) {
    document.querySelector('.selected').classList.toggle('selected');
    currentElement.classList.add('selected');
  };

  navigationMenu.addEventListener('click', function (e) {
    toggleMenu();
  });

  /**
    * toggles visibility of the menu for mobile browsers
    */
  function toggleMenu() {
    navigation.classList.toggle('visible');
  };
};


