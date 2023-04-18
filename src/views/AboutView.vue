<template data-page="about">
  <div class="about">
    <h1>About Notedown</h1>

    <section class="subsection">
      <h2>What is Notedown?</h2>
      <p>
        Notedown is a powerful note-taking application designed to help you
        quickly create, edit, and save your notes in both Markdown and HTML
        formats. It offers a user-friendly interface for organizing your
        thoughts, writing down important information, and sharing your notes
        with others.
      </p>
    </section>

    <section class="subsection">
      <h2>How much does it cost?</h2>
      <p>
        Notedown is completely free to use! We believe that everyone should have
        access to a powerful note-taking tool without having to worry about the
        cost.
      </p>
    </section>

    <section class="subsection">
      <h2>Can I export my notes?</h2>
      <p>
        Yes, you can easily export your notes in either Markdown or HTML format,
        allowing you to use them in other applications or share them with
        others.
      </p>
    </section>

    <section class="subsection">
      <h2>Can I share my notes?</h2>
      <p>
        Absolutely! Notedown offers a built-in sharing feature that generates a
        shareable link for your notes. This makes it easy to collaborate with
        others and keep everyone on the same page.
      </p>
    </section>

    <section class="contact-us">
      <h2>Contact Us</h2>
      <div class="contact-info">
        <div class="info-column">
          <p>Email: notedownadmin@notedown.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
        <div class="info-column">
          <p>
            1234 Main Street<br />
            Suite 567<br />
            City, State, 12345<br />
            Country
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Dongle:wght@400;700&family=Fira+Sans:wght@500&family=Montserrat:ital,wght@0,400;0,500;1,600&family=Nunito:wght@500&family=Poppins:wght@400;500&display=swap');
*{
  font-family: 'Montserrat', sans-serif;
}
.about h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  padding-bottom: 14px;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}
h3{
  margin-bottom: 0.5rem;
}
.about{
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  height: 120vh;
}
.subsection {
  margin-bottom: 2rem;
}

.subsection p {
  font-size: 0.7rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: left;
  padding-left: 18px;
  padding-right: 18px;
}

.contact-us {
  margin-top: 3rem;
}
.contact-us p{
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  padding-left: 18px;
  padding-right: 18px;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 3.6rem;
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
