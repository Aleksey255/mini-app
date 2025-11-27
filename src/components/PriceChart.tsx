import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ScriptableContext,
  type ScaleOptionsByType,
} from 'chart.js'
import annotationPlugin, {
  type LineAnnotationOptions,
  type BoxAnnotationOptions,
  type LabelAnnotationOptions,
  type AnnotationOptions,
} from 'chartjs-plugin-annotation'

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    fill: boolean
    backgroundColor: (context: ScriptableContext<'line'>) => CanvasGradient
    borderColor: string
    borderWidth: number
    tension: number
    pointRadius: number
  }[]
}

export const PriceChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: Array.from({ length: 10 }, (_, i) => `10:${i * 5}`),
    datasets: [
      {
        label: 'Цена',
        data: Array.from(
          { length: 10 },
          (_, i) => 15000 + (i % 2 === 0 ? 5000 : -5000)
        ), // Начальные данные около 15000
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, 'rgba(255, 165, 0, 0.1)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          return gradient
        },
        borderColor: '#FFA500', // Оранжевая линия
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0, // Скрываем точки
      },
    ],
  })

  const [currentPrice, setCurrentPrice] = useState<number>(15000)

  useEffect(() => {
    // Имитация реального времени обновления данных каждые 5 секунд
    const intervalId = setInterval(() => {
      setChartData(prevData => {
        const newLabels = [
          ...prevData.labels.slice(1),
          `10:${(prevData.labels.length % 12) * 5}`,
        ]
        // Генерируем новое значение цены с небольшим изменением
        const lastPrice =
          prevData.datasets[0].data[prevData.datasets[0].data.length - 1]
        const newPrice = lastPrice + (Math.random() > 0.5 ? 10000 : -10000) // Изменение ±10

        const newData = [...prevData.datasets[0].data.slice(1), newPrice]
        setCurrentPrice(newPrice)

        return {
          ...prevData,
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        }
      })
    }, 5000)

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId)
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Скрываем легенду
      },
      tooltip: {
        enabled: true,
      },
      annotation: {
        annotations: {
          currentPriceLine: {
            type: 'line' as const,
            xMin: chartData.labels.length - 1,
            xMax: chartData.labels.length - 1,
            yMin: 0,
            yMax: currentPrice,
            borderColor: '#00FF00',
            borderWidth: 2,
          } as LineAnnotationOptions,
          currentPriceBox: {
            type: 'box' as const,
            xMin: chartData.labels.length - 1 - 0.2,
            xMax: chartData.labels.length - 1 + 0.2,
            yMin: currentPrice - 50,
            yMax: currentPrice + 50,
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            borderColor: '#00FF00',
            borderWidth: 1,
          } as BoxAnnotationOptions,
          currentPriceText: {
            type: 'label' as const,
            xValue: chartData.labels.length - 1.5,
            yValue: currentPrice,
            content: currentPrice.toFixed(2),
            backgroundColor: '#00FF00',
            color: '#000000',
            borderRadius: 4,
            padding: 6,
            textAlign: 'center',
            fontSize: 12,
          } as LabelAnnotationOptions,
        } as unknown as Record<string, AnnotationOptions>,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Скрываем сетку по X
        },
        ticks: {
          color: '#888', // Серый цвет меток времени
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 255, 0, 0.2)', // Зеленая сетка
        },
        ticks: {
          color: '#00FF00', // Зеленый цвет меток цен
          font: {
            size: 12,
          },
          callback: function (value: number | string) {
            return typeof value === 'number' ? value.toFixed(2) : value // Форматируем до 2 знаков после запятой
          },
        } as Partial<ScaleOptionsByType<'linear'>['ticks']>,
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  }

  return (
    <div className={'w-full'}>
      <Line data={chartData} options={options} />
    </div>
  )
}
