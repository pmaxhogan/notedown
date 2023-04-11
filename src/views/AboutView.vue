<script setup></script>

<template data-page="about">
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
/*body {
    background: linear-gradient(
      to right,
      #322467 0%,
      #322467 25%,
      transparent 25%,
      transparent 75%,
      #322467 75%,
      #322467 100%
    );
  } */

.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: left;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.subsection {
  margin-bottom: 2rem;
}

p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: left;
}

.contact-us {
  margin-top: 3rem;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.info-column {
  flex: 1;
}

@media (max-width: 767px) {
  .info-column {
    flex: none;
    width: 100%;
  }
}
</style>
