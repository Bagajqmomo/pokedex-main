<template>
  <div class="glitch" data-text="ERROR">ERROR</div>
</template>

<style lang="scss" scoped>
.glitch {
  font-size: 72px;
  position: relative;
  color: white;
  cursor: default;
  text-transform: uppercase;
  animation: glitch-animation 0.5s infinite linear;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
}
.glitch::before {
  color: #f00;
  text-shadow: -2px 0 #0f0;
  animation: glitch-animation-before 0.5s infinite linear;
}

.glitch::after {
  color: #0ff;
  text-shadow: 2px 0 #f0f;
  animation: glitch-animation-after 0.5s infinite linear;
}

@keyframes glitch-animation {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2x, 0);
  }
  40% {
    transform: translate(2px, 0);
  }
  60% {
    transform: translate(-2px, 0);
  }
  80% {
    transform: translate(2px, 0);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch-animation-before {
  0% {
    transform: translate(0) skew(0deg);
  }
  20% {
    transform: translate(-2px, 0) skew(0deg);
  }
  40% {
    transform: translate(-2px, 0) skew(0deg);
  }
  60% {
    transform: translate(2px, 0) skew(0deg);
  }
  80% {
    transform: translate(2px, 0) skew(0deg);
  }
  100% {
    transform: translate(0) skew(0deg);
  }
}

@keyframes glitch-animation-after {
  0% {
    transform: translate(0) skew(0deg);
  }
  20% {
    transform: translate(2px, 0) skew(0deg);
  }
  40% {
    transform: translate(2px, 0) skew(0deg);
  }
  60% {
    transform: translate(2x, 0) skew(0deg);
  }
  80% {
    transform: translate(-2px, 0) skew(0deg);
  }
  100% {
    transform: translate(0) skew(0deg);
  }
}
</style>
