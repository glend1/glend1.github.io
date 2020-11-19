window.onload = function() {
    var profile = document.querySelector("#profile");
    var profileLink = document.querySelector("#profile-link");
    var experiance = document.querySelector("#experiance");
    var experianceLink = document.querySelector("#experiance-link");
    var skills = document.querySelector("#skills");
    var skillsLink = document.querySelector("#skills-link");
    var links = document.querySelector("#links");
    var linksLink = document.querySelector("#links-link");

    window.addEventListener('scroll', function(e) {
        let currentPos = document.documentElement.scrollTop;
        if ( currentPos >= profile.offsetTop && currentPos < experiance.offsetTop) {
            setClass(profileLink);
        } else if ( currentPos >= experiance.offsetTop && currentPos < skills.offsetTop) {
            setClass(experianceLink);
        } else if ( currentPos >= skills.offsetTop && currentPos < links.offsetTop) { 
            setClass(skillsLink);
        } else if ( currentPos >= links.offsetTop) {
            setClass(linksLink);
        }
    });

    function setClass(currentElement) {
        profileLink.classList.remove("selected");
        experianceLink.classList.remove("selected");
        skillsLink.classList.remove("selected");
        linksLink.classList.remove("selected");
        currentElement.classList.add("selected");
        console.log(document.documentElement.scrollTop);
    }
};


