import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '~/styles/Home.module.scss'
import { generateTrending } from '~/utils/tfidf';
import strippedPosts from '~/utils/tfidf/lib/posts';
import { ai, aiStripped } from '~/data';
import Link from 'next/link';

export default function AI() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState(ai);
  const [trendings, setTrendings] = useState([]);

  const [active, setActive] = useState('local');

  const user = useMemo(() => ({
    avatar: '/user.png',
    name: 'Usuário Teste',
    username: 'skywalker'
  }), [])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const a = generateTrending(content);
      console.log('a', a);
      await new Promise(r => setTimeout(r, 3000));
      setTrendings(a);
      setPosts(p => [content, ...p]);
      setModalOpen(false);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [content]);

  useEffect(() => {
    setTrendings( // @ts-ignore
      generateTrending(aiStripped.map(b => generateTrending(b)).join(',')).split(' ')
    );
  }, []);

  return (
    <>
      <Head>
        <title>Friendica Demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <header>
          <div>
            <nav>
              <button>
                <i className="fa fa-navicon" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-home" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-bullseye" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-envelope" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-calendar" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-group" aria-hidden="true" />
              </button>
              <button>
                <i className="fa fa-bell" aria-hidden="true" />
              </button>
            </nav>
            <i className="fa fa-friendica" aria-hidden="true" />
            <span>
              <input type="text" placeholder="Pesquisar..." />
              <div>
                <span>
                  <strong>{user.name}</strong>
                </span>
                <img src={user.avatar} alt={user.name} />
              </div>
            </span>
          </div>
        </header>
        <div className={styles.subheader}>
          <div>
            <div />
            <div>
              <button onClick={() => setActive('local')}>
                Comunidade Local
                {active === 'local' && <span />}
              </button>
              <button onClick={() => setActive('global')}>
                Comunidade Global
                {active === 'global' && <span />}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.trendingContainer}>
          <div className={styles.trending}>
            <strong>
              <i className="fa fa-caret-right" aria-hidden="true" />
              <b>Tipos de Conta</b>
            </strong>
          </div>
            <div className={styles.trending}>
              <strong>
                <i className="fa fa-caret-down" aria-hidden="true" />
                <b>Trending Topics</b>
              </strong>
              {!!trendings.length &&
                trendings.map((t, i) =>
                  <div key={i}>
                    <strong>{i+1}. {t}</strong>
                    <p>3 publicações</p>
                  </div>
                )}
            </div>
          </div>
          {active === 'local' ? 
            <div className={styles.posts}>
              {posts.map((p, i) => !p.includes('~base') &&
                <div key={i}>
                  <header>
                    <img src={user.avatar} alt={user.name} />
                    <span>
                      <strong>{user.name}</strong>
                      <small>@{user.username}</small>
                    </span>
                  </header>
                  <p>{p}</p>
                  <nav>
                    <div>
                      <i className="fa fa-thumbs-up" aria-hidden="true" />
                      <small>Curtida</small>
                    </div>
                    <div>
                      <i className="fa fa-thumbs-down" aria-hidden="true" />
                      <small>Não curtiu</small>
                    </div>
                    <div>
                      <i className="fa fa-commenting" aria-hidden="true" />
                      <small>Comentar</small>
                    </div>
                    <div>
                      <i className="fa fa-ellipsis-h" aria-hidden="true" />
                      <small>Mais</small>
                    </div>

                  </nav>
                </div>
              )}
              <button onClick={() => setModalOpen(true)}>
                <img src="/post.svg" alt="post" />
              </button>
            </div> : 
            <div className={styles.sections}>
              <h2>Seções</h2>
              <Link href="/">Privacidade em Redes Sociais</Link>
              <Link href="/ufo">OVNIs</Link>
              <Link href="/ai">Inteligência Artificial e empregos</Link>
              <Link href="/pandemic">Trabalho pós-pandemia</Link>
            </div>
            }
        </div>
        {modalOpen &&
          <div
            className={styles.modalContainer}
            onClick={() => {
              setModalOpen(false);
              setContent('');
            }}
          >
            <div
              className={styles.postContainer}
              onClick={(e) => 
                e.stopPropagation()
              }
            >
              <textarea
                placeholder="Escreva qualquer coisa..."
                value={content}
                spellCheck={false}
                onChange={(e) => setContent(e.target.value)}
              />
              <div>
                <div>
                  <img src={user.avatar} alt={user.name} />
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.username}</small>
                  </span>
                </div>
                <button
                  disabled={!content}
                  onClick={handleSubmit}
                >
                  {loading ?
                    <img src="/loading.svg" alt="loading" /> : 'Postar'
                  }
                </button>
              </div>
            </div>
          </div>
        }
      </main>
    </>
  )
}
