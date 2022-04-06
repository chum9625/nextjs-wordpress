import React from 'react';
import Typography from '@mui/material/Typography';

import styles from './Intro.module.scss';

const Intro: React.FC = () => (
  <section className={styles.container}>
    <Typography variant="h1" className={styles.title}>
      Next.js WordPress boilerplate MUCHA2.
    </Typography>
  </section>
);

export default Intro;
