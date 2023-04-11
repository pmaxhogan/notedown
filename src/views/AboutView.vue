<script setup>
import { useCollection } from "vuefire";
import { db } from "@/main.js";
import { collection } from "firebase/firestore";

const todos = useCollection(collection(db, "todos"));
</script>

<template data-page="about">
  <div class="about">
    <h1>About Notedown</h1>

    <section class="subsection">
      <h2>What is Notedown?</h2>
      <p>
        Notedown is a powerful note-taking application designed to help you quickly create, edit, and save your notes in both Markdown and HTML formats. It offers a user-friendly interface for organizing your thoughts, writing down important information, and sharing your notes with others.
      </p>
    </section>

    <section class="subsection">
      <h2>How much does it cost?</h2>
      <p>
        Notedown is completely free to use! We believe that everyone should have access to a powerful note-taking tool without having to worry about the cost.
      </p>
    </section>

    <section class="subsection">
      <h2>Can I export my notes?</h2>
      <p>
        Yes, you can easily export your notes in either Markdown or HTML format, allowing you to use them in other applications or share them with others.
      </p>
    </section>

    <section class="subsection">
      <h2>Can I share my notes?</h2>
      <p>
        Absolutely! Notedown offers a built-in sharing feature that generates a shareable link for your notes. This makes it easy to collaborate with others and keep everyone on the same page.
      </p>
    </section>

    <section class="contact-us">
    <h2>Contact Us</h2>
    <div class="contact-info">
      <div class="info-column">
        <h3>Email</h3>
        <p>notedownadmin@notedown.com</p>
        <h3>Phone</h3>
        <p>+1 (123) 456-7890</p>
      </div>
      <div class="info-column">
        <h3>Address</h3>
        <p>
          1234 Main Street<br>
          Suite 567<br>
          City, State, 12345<br>
          Country
        </p>
      </div>
    </div>
  </section>
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