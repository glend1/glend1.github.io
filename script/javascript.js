window.onload = function() {
    var profileLink = document.querySelector("#profile-link");
    var experiance = document.querySelector("#experiance");
    var experianceLink = document.querySelector("#experiance-link");
    var skills = document.querySelector("#skills");
    var skillsLink = document.querySelector("#skills-link");
    var linksLink = document.querySelector("#links-link");
    var navigationMenu = document.querySelector("#menu-img");
    var navigation = document.querySelector("nav");
    var navigationlink = document.querySelector("nav ul a")
        
    function isMobile() {
        let isMobile = window.getComputedStyle(navigationMenu).display == "none" ? false : true;
        return isMobile;
    }

    navigationlink.addEventListener('click', function(e) {
        if (isMobile()) toggleMenu();
    })

    window.addEventListener('scroll', function(e) {
        //the +1 is because the scroll value is a pixel off
        if (isMobile()) { 
            navigation.classList.remove("visible");
        }
        let currentPos = document.documentElement.scrollTop + 1;
        if (currentPos < experiance.offsetTop) {
            setClass(profileLink);
        } else if (currentPos < skills.offsetTop) {
            setClass(experianceLink);
        } else if (window.innerHeight + document.documentElement.scrollTop == document.documentElement.offsetHeight)  {
            setClass(linksLink);    
        } else {
            setClass(skillsLink);
        }  
    });

    function setClass(currentElement) {
        document.querySelector(".selected").classList.toggle("selected");    
        currentElement.classList.add("selected");
    };

    navigationMenu.addEventListener("click", function(e) {
        toggleMenu();
    });

    function toggleMenu() {
        navigation.classList.toggle("visible");
    }
};


