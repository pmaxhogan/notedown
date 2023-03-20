<script></script>

<template>
  <header>
    <p>Welcome to NoteDown</p>
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/markdown">Markdown</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

...
<style lang="scss">
header {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  max-height: 100vh;

  p {
    margin-left: 1rem;
  }
}

nav {
  margin-left: auto;
  text-align: center;
  font-size: 14px;

  ul {
    list-style: none;
  }

  ul li {
    display: inline-flex;
    margin-left: 1rem;
  }
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
