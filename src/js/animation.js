//jshint esversion:6

const button = document.querySelector(".btn"),
  darkroom = document.querySelector(".darkroom"),
  giftroom = document.querySelector(".giftroom"),
  hallway = document.querySelector(".hallway"),
  room = document.querySelector(".empty-room"),
  flash = document.querySelector(".flash");

// These are the text elements that hold messages to be displayed in the respective screes

const blackText = document.querySelectorAll(".bb-text"), // msgs in the dark room scene
  giftText = document.querySelectorAll(".gift-text"), // msgs in the gift scene
  hallText = document.querySelectorAll(".hall-text"), // msgs in the hallway scene
  roomText = document.querySelectorAll(".room-text"), // msgs in empty room scene
  CTAtext = document.querySelector(".btn-ref");

//Elements in the card page

const frames = document.querySelectorAll(".frame"),
  msgWindow = document.querySelector(".scroll"), // this one has the message frame in [0] and card fram in [1]
  msg = document.querySelector(".text"), // the Message para
  hbdMsg = document.querySelector(".HBD"); // the HBD message

//Sfx files

const light = document.querySelector(".switch-aud"),
  blast = document.querySelector(".blast-aud"),
  door = document.querySelector(".door-aud"),
  haunt = document.querySelector(".haunt-aud"),
  music = document.querySelector(".hbd-aud");

//  readMsg() displays the paras in each scene successively. It takes an array of the para elements as input.

const readMsg = (text) => {
  for (let i = 0; i < text.length; i++) {
    // this loop goes through all the text msg paras
    setTimeout(() => {
      // Speed up: reduced from 5s to 2s
      text[i].classList.add("read"); // this adds a fadeIn-fadeOut animation to elements
      if (i === text.length - 1) {
        // this ensures that the button appears only after the last text is displayed.
        button.style.display = "inline-block";
        CTAtext.style.display = "block";
      }
    }, 3500 * i); // Slower: 2000 -> 3500
  }
};

// Streaming text animation - types out text character by character
const streamText = (element, text, speed = 50) => {
  if (!element || !text) return;
  
  element.textContent = ""; // Clear the element
  element.style.opacity = "1"; // Make sure it's visible
  
  // Add blinking cursor
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.textContent = "|";
  element.appendChild(cursor);
  
  let index = 0;
  const typeChar = () => {
    if (index < text.length) {
      // Remove cursor, add character, then add cursor back
      cursor.remove();
      const char = text[index];
      element.textContent += char;
      element.appendChild(cursor);
      index++;
      
      // Vary speed slightly for more natural feel
      const delay = char === " " ? speed * 0.3 : speed;
      setTimeout(typeChar, delay);
    } else {
      // Remove cursor when done
      cursor.remove();
    }
  };
  
  typeChar();
};

// transition() is animation for change from one scene to another. It takes the current scene div element as input.

const transition = (currentScene) => {
  currentScene.classList.add("fade-in");
  currentScene.style.opacity = "0";
  button.style.display = "none";
  CTAtext.style.display = "none";
};

//Animation Code

/*
    In the beginning, the black page appears signifying a dark room and after displaying the msg paras
    one by one, a button(bulb) appears and the user is asked to click the button to swith on the lights.
*/

export const animate = function () {
  CTAtext.innerHTML = "Click the Light Bulb.";

  readMsg(blackText);

  button.addEventListener("click", function () {
    if (button.classList.contains("switch")) {
      /* 
              When the switch is pressed, the black div will wipe out and the backgroung scene with no 
              elements will appear, signifying that the lights are turned on and the room is empty. Then 
              the msg will be displayed after which, the user will be asked to move out and the button with
              door icon will appear. 
          */

      light.play();
      transition(darkroom);
      CTAtext.innerHTML = "Click the Door";
      setTimeout(function () {
        button.classList.add("door-out");
        button.classList.remove("switch");
        darkroom.style.display = "none";
        readMsg(roomText);
      }, 3500); // Slower: 2000 -> 3500
    } else if (button.classList.contains("door-out")) {
      /* 
              when the door is pressed, scene changes to cemetry. Again, the msg will be displayed, after 
              which, the user will be asked to come inside and the button with door will appear again.
          */

      door.play();
      transition(room);
      setTimeout(function () {
        haunt.play();
        haunt.loop = true;
        button.classList.add("door-in");
        button.classList.remove("door-out");
        room.style.display = "none";
        readMsg(hallText);
      }, 3500); // Slower: 2000 -> 3500
    } else if (button.classList.contains("door-in")) {
      /* 
              when the door is pressed, scene changes to the gift room. Again, the msg will be displayed, after 
              which, the user will be asked to open the gift and the button with gift will appear.
          */

      door.play();
      transition(hallway);
      CTAtext.innerHTML = "Click the Gift";
      setTimeout(function () {
        button.classList.add("gift");
        button.classList.remove("door-in");
        hallway.style.display = "none";
        readMsg(giftText);
      }, 3500); // Slower: 2000 -> 3500
    } else if (button.classList.contains("gift")) {
      /* 
              when the gift is pressed, the gift scene vanishes and the white div fades slowly giving a sense 
              of explosion. After that, the message frame appears and moves up until the message completes. Then,
              the message frame fades away and the card appears.
          */

      haunt.pause();
      blast.play();
      giftroom.style.display = "none";
      transition(flash);

      music.loop = true;
      music.play();

      if (!process.env.SCROLL_MSG) {
        frames[0].style.display = "flex";
        setTimeout(() => {
          frames[0].classList.add("appear");
          frames[0].style.opacity = "1";
          // Show photo gallery when card appears
          const photoGallery = document.querySelector(".photo-gallery");
          if (photoGallery) {
            photoGallery.classList.add("show-photos");
            photoGallery.style.opacity = "1";
          }
          // Stream the HBD message
          if (hbdMsg && hbdMsg.textContent) {
            const originalText = hbdMsg.textContent;
            streamText(hbdMsg, originalText, 50); // Slower: 30 -> 50
          }
        }, 1200); // Slower: 800 -> 1200
        return;
      }

      //This value is stored in the --readTime css variable of root element and is calculated dynamically at build time.
      // Speed up scroll message by reducing the time
      const readTime =
        (parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--readTime"
          )
        ) + 5) * 0.8; // Slower: multiply by 0.8 (was 0.6 for faster)

      frames[1].style.display = "flex";

      setTimeout(() => {
        frames[1].classList.add("appear");
        frames[1].style.opacity = "1";
        msg.classList.add("move-up");
      }, 800); // Speed up: 1500 -> 800

      setTimeout(() => {
        msg.style.transform = "translateY(-100%)";
        flash.style.display = "none";
      }, 4500); // Slower: 3000 -> 4500

      setTimeout(() => {
        msgWindow.classList.add("fade-in");
        msgWindow.style.opacity = "0";
      }, readTime * 1000);

      setTimeout(() => {
        frames[1].style.display = "none";
        frames[0].style.display = "flex";
        frames[0].classList.add("appear");
        frames[0].style.opacity = "1";
        // Show photo gallery when card appears
        const photoGallery = document.querySelector(".photo-gallery");
        if (photoGallery) {
          photoGallery.classList.add("show-photos");
          photoGallery.style.opacity = "1";
        }
        // Stream the HBD message when card appears
        if (hbdMsg && hbdMsg.textContent) {
          const originalText = hbdMsg.textContent;
          streamText(hbdMsg, originalText, 30); // Speed up: 40 -> 30
        }
      }, (readTime + 3) * 1000);
    }
  });
};
