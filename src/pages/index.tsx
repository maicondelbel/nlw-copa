/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import AppIllustration from '../assets/nlw-copa-illustration.png'
import AvatarsGroup from '../assets/nlw-copa-avatars-group.png'
import CheckIcon from '../assets/green-check-icon.svg'
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Logo from '../assets/logo.svg'
import { api } from './../lib/axios'
import { Session } from 'next-auth'
import Image from 'next/image'
import axios from 'axios'

interface IHomeProps {
  session?: Session
  poolCount: number
  guessCount: number
  userCount: number
}

interface IFormInput {
  poolName: string
}

export default function Home({ poolCount, guessCount, userCount }: IHomeProps) {
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>()

  const [accessToken, setAccessToken] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    if (session) {
      authenticate()
    }
  }, [])

  async function authenticate() {
    try {
      const responseAuth = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth`,
        {
          access_token: session?.accessToken,
        },
      )
      const { token } = responseAuth.data
      setAccessToken(token)
    } catch (error) {
      console.log(error)
      alert(
        'Problema ao se autenticar com o backend! Por favor, faça login novamente.',
      )
      signOut()
    }
  }

  async function onSubmit(formData: IFormInput) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pools`,
        {
          title: formData.poolName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      const { code } = response.data
      await navigator.clipboard.writeText(code)
      reset()
      router.replace(router.asPath)
      alert(
        'Bolão criado com sucesso! O código foi copiado para a área de transferência.',
      )
    } catch (error) {
      console.log(error)
      alert('Ocorreu um erro ao criar o bolão!')
    }
  }

  return (
    <main className="flex flex-col max-w-[1172px] sm:h-screen mx-auto px-6 my-10 sm:my-0">
      <div className="my-auto">
        <header className="max-w-[625px] mx-auto lg:max-w-full">
          <Image src={Logo} alt="NLW Copa" />
        </header>
        <div className="flex">
          <div className="lg:basis-1/2 basis-full flex justify-center">
            <div className="max-w-[650px]">
              <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
                Crie seu próprio bolão da copa e compartilhe entre amigos!
              </h1>
              <div className="mt-10 flex items-center gap-2">
                <Image src={AvatarsGroup} alt="" />
                <strong className="text-gray-100 text-xl">
                  <span className="text-nlw-green-500">+{userCount}</span>{' '}
                  {userCount === 1 ? 'pessoa já está' : 'pessoas já estão'}{' '}
                  usando
                </strong>
              </div>
              <form
                className="mt-12 relative"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex-col sm:flex-row flex gap-2">
                  <input
                    {...register('poolName', { required: true, minLength: 5 })}
                    placeholder="Qual nome do seu bolão?"
                    type="text"
                    className={`outline-0 px-6 py-4 text-sm flex-1 rounded bg-gray-800 border text-gray-200 leading-relaxed ${
                      errors.poolName ? `border-red-500` : `border-gray-600`
                    }`}
                  />
                  {session ? (
                    <button className="px-6 py-4 bg-yellow-500 font-bold text-sm rounded">
                      CRIAR MEU BOLÃO
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-6 py-4 bg-yellow-500 font-bold text-sm rounded"
                      onClick={() => signIn('google')}
                    >
                      CRIAR MEU BOLÃO
                    </button>
                  )}
                </div>
                {errors.poolName && (
                  <small className="text-red-400 absolute mt-1">
                    O nome precisa ter mais que 5 caracteres
                  </small>
                )}
              </form>
              {session && (
                <div className="text-xs mt-6 flex gap-3 justify-end">
                  <span className="text-green-300 ">
                    Criando como: {session.user?.name}
                  </span>
                  <span
                    className="text-red-300 cursor-pointer font-bold"
                    onClick={() => signOut()}
                  >
                    Sair?
                  </span>
                </div>
              )}
              <p className="text-gray-300 mt-5">
                Após criar seu bolão, você receberá um código único que poderá
                usar para convidar outras pessoas 🚀
              </p>
              <div className="mt-10 pt-10 border-t border-t-gray-600 flex justify-between">
                <div className="flex items-center gap-6 basis-1/2 border-r border-r-gray-600 pr-6 sm:p-0">
                  <Image src={CheckIcon} alt="" />
                  <div className="flex flex-col">
                    <strong className="text-2xl leading-snug text-gray-100">
                      +{poolCount}
                    </strong>
                    <span className="text-gray-100">
                      {poolCount === 1 ? 'Bolão criado' : 'Bolões criados'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 basis-1/2 justify-end pl-6 sm:p-0">
                  <Image src={CheckIcon} alt="" />
                  <div className="flex flex-col">
                    <strong className="text-2xl leading-snug text-gray-100">
                      +{guessCount}
                    </strong>
                    <span className="text-gray-100">
                      {guessCount === 1
                        ? 'Palpite enviado'
                        : 'Palpites enviados'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:basis-1/2">
            <Image
              className="ml-auto"
              src={AppIllustration}
              alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
              quality={100}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ])

  if (session) {
    return {
      props: {
        session,
        poolCount: poolCountResponse.data.count,
        guessCount: guessCountResponse.data.count,
        userCount: userCountResponse.data.count,
      },
    }
  }

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
