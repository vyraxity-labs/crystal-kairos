import { auth } from '@/auth'

const AdminDashboardPage = async () => {
  const session = await auth()
  return (
    <div>
      <h2>{session?.user.name}</h2>
      <p>{session?.user.role}</p>

      <div className='p-10 md:p-36 bg-red-200'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          deserunt sed id atque aspernatur nemo, officiis reprehenderit dolores
          nobis assumenda, ad ex praesentium accusamus quo dolorum quod autem
          vitae molestias! Impedit nostrum neque ratione tempore deserunt
          voluptatum quibusdam placeat laborum! Fugit maxime cupiditate ad
          obcaecati expedita earum eos, ullam esse!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          deserunt sed id atque aspernatur nemo, officiis reprehenderit dolores
          nobis assumenda, ad ex praesentium accusamus quo dolorum quod autem
          vitae molestias! Impedit nostrum neque ratione tempore deserunt
          voluptatum quibusdam placeat laborum! Fugit maxime cupiditate ad
          obcaecati expedita earum eos, ullam esse!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          deserunt sed id atque aspernatur nemo, officiis reprehenderit dolores
          nobis assumenda, ad ex praesentium accusamus quo dolorum quod autem
          vitae molestias! Impedit nostrum neque ratione tempore deserunt
          voluptatum quibusdam placeat laborum! Fugit maxime cupiditate ad
          obcaecati expedita earum eos, ullam esse!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          deserunt sed id atque aspernatur nemo, officiis reprehenderit dolores
          nobis assumenda, ad ex praesentium accusamus quo dolorum quod autem
          vitae molestias! Impedit nostrum neque ratione tempore deserunt
          voluptatum quibusdam placeat laborum! Fugit maxime cupiditate ad
          obcaecati expedita earum eos, ullam esse!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          deserunt sed id atque aspernatur nemo, officiis reprehenderit dolores
          nobis assumenda, ad ex praesentium accusamus quo dolorum quod autem
          vitae molestias! Impedit nostrum neque ratione tempore deserunt
          voluptatum quibusdam placeat laborum! Fugit maxime cupiditate ad
          obcaecati expedita earum eos, ullam esse!
        </p>
      </div>
    </div>
  )
}

export default AdminDashboardPage
